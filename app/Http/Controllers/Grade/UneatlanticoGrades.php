<?php

namespace App\Http\Controllers\Grade;

use App\Http\Controllers\Interfaces\IGrades;
use App\Models\Grade;
use App\Models\Structure;
use App\Models\ViewGrade;
use App\Models\ViewActivity;
use App\Models\ViewStructure;
use App\Models\ViewItemCategory;
use App\Models\ViewItem;
use App\Http\Controllers\Data\MoodleRequestFacade;
use PhpParser\Node\Stmt\Foreach_;

class UneatlanticoGrades extends IGrades
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    //Grade a structure
    public function retrieveAllGradesForStructure($structureId)
    {
        $itemCategories = ViewItemCategory::where('structure_id', $structureId)->get();
        $allItems = [];
        foreach ($itemCategories as $category) {

            $items[] = ViewItem::where('category_id', $category->id)->get();

            foreach ($items as $item) {

                if (sizeof($item)) {
                    foreach ($item as $i) {
                        $allItems[] = $i;
                    }
                }
            }
            unset($items);
        }

        foreach ($allItems as $item) {

            $this->updateOrCreateItemGrades($item->id, $structureId);
        }
        $structure = Structure::findOrFail($structureId);
        $structure->graded = 1;
        $structure->save();
        return $this->getGradesByStructure($structureId);
    }
    public function getFinalGrades($structureId)
    {
        $item_categories = ViewItemCategory::where('structure_id', $structureId)->get();

        foreach ($item_categories as $itemCategory) {

            $items = ViewItem::where('category_id', $itemCategory->id)->get();
            $finalGrades = [];
            foreach ($items as $item) {

                $grades = ViewGrade::where('item_id', $item->id)->get();
                foreach ($grades as $grade) {
                    if (!array_key_exists($grade->username, $finalGrades)) {
                        $finalGrades[$grade->username] = [];
                    }

                    array_push($finalGrades[$grade->username], $grade->value * ($item->weight / 100));
                }
            }

            foreach ($finalGrades as $key => $final) {
                $finalGrades[$key] = array_reduce($final, function ($carry, $item) {
                    $carry += $item;
                    return $carry;
                });
            }
            $itemCategory->final = $finalGrades;
        }
        return $item_categories;
    }

    public function updateOrCreateItemGrades($itemId, $structureId)
    {
        $activities = ViewActivity::where('item_id', $itemId)->get();
        $grades = null;

        if (sizeof($activities)) { //TODO: Contemplar 1 actividad por item, falta comprobarlo
            $activity = $activities[0];
            $grades = $this->retrieveActivityGrades($activity, $structureId);
        } else {
            $grades = $this->retrieveEmptyGrades($structureId);
        }
        foreach ($grades as $grade) {
            Grade::updateOrCreate(
                ['userid' => $grade['userid'], 'username' => $grade['fullname'], 'item_id' => $itemId],
                ['value' => $grade['grade']]
            );
        }
    }

    public function getMoodleActivityParticipants($activityId)
    {
        $moodleId = 1;
        $funcion = "mod_assign_list_participants";
        $params = [];
        $params['assignid'] = $activityId;
        $params['groupid'] = 0;
        $params['filter'] = "";
        $moodleRequest = new MoodleRequestFacade;
        $assign_participants = $moodleRequest->makeMoodleApiRequest($moodleId, $funcion, $params);
        return $assign_participants;
    }

    public function getUserInfo($userId)
    {
        $moodleId = 1;
        $funcion = "core_user_get_users_by_field";
        $params = [];
        $params['field'] = "id";
        $params['values[0]'] = $userId;
        $moodleRequest = new MoodleRequestFacade;
        $user_info = $moodleRequest->makeMoodleApiRequest($moodleId, $funcion, $params);
        return $user_info;
    }

    public function getMoodleGroupParticipants($groupId)
    {
        $moodleId = 1;
        $funcion = "core_group_get_group_members";
        $params = [];
        $params['groupids[0]'] = $groupId;
        $moodleRequest = new MoodleRequestFacade;
        $group_participants = $moodleRequest->makeMoodleApiRequest($moodleId, $funcion, $params);
        return $group_participants;
    }
    public function getStructureParticipants($structureId)
    {
        $structure = ViewStructure::findOrFail($structureId);
        //TODO: Se están obteniendo solo los participantes de grupos, habrá que prepararlo para aceptar grados
        if ($structure->mode === "group") {
            $group_participants = $this->getMoodleGroupParticipants($structure->mode_value);

            $participants = [];
            foreach ($group_participants[0]['userids'] as $userId) {
                $userInfo = $this->getUserInfo($userId);
                $user = (object) ['userid' => $userId, 'username' => $userInfo[0]['fullname']];
                $participants[] = $user;
                unset($user);
            }

            return $participants;
        } elseif ($structure->mode === "course") {
        }
    }
    public function getMoodleActivityInfo($activityCmid)
    {
        $moodleId = 1;
        $funcion = "core_course_get_course_module";
        $params = [];
        $params['cmid'] = $activityCmid;
        $moodleRequest = new MoodleRequestFacade;
        $assign_info = $moodleRequest->makeMoodleApiRequest($moodleId, $funcion, $params);
        return $assign_info;
    }
    public function getMoodleActivityGrades($activityId)
    {
        $moodleId = 1;
        $funcion = "mod_assign_get_grades";
        $params = [];
        $params['assignmentids[0]'] = $activityId;
        $moodleRequest = new MoodleRequestFacade;
        $assign_grades = $moodleRequest->makeMoodleApiRequest($moodleId, $funcion, $params);
        return $assign_grades;
    }
    public function retrieveEmptyGrades($structureId)
    {
        //get participants
        $moodle_participants = $this->getStructureParticipants($structureId);
        $grades = [];
        //get grades final array
        foreach ($moodle_participants as $participant) {
            $grades[$participant->userid] = array(
                //"submitted" => $participant['submitted'], "requiregrading" => $participant['requiregrading'],
                "userid" => $participant->userid, "fullname" => $participant->username,
                "grade" => 0
            );
            unset($grade);
        }
        return $grades;
    }
    public function retrieveActivityGrades($activity, $structureId)
    {

        //$activityId = $activity->instance;
        //$this->getMoodleActivityParticipants($activity->instance);
        $grades = $this->retrieveEmptyGrades($structureId);
        //get assign info
        $moodle_assign_info = $this->getMoodleActivityInfo($activity->cmid);

        $assign_max_grade = $moodle_assign_info['cm']['grade'];

        //get assign grades

        $moodle_assign_grades = $this->getMoodleActivityGrades($activity->instance)['assignments'][0]['grades'];


        //Modify grade if the user have it, else default 0.00
        foreach ($moodle_assign_grades as $grade) {

            if (array_key_exists($grade['userid'], $grades)) {
                //ID unico para no duplicar notas en bd
                $grades[$grade['userid']]['grade'] = $grade['id'];
                //$grade->grade could be -1 if the teacher check the attempt but don't grade it 
                //convertir nota a base 10 y guardarla
                if ($grade['grade'] > 0) {
                    $grades[$grade['userid']]['grade'] = (($grade['grade']) / $assign_max_grade) * 10;
                } else {
                    $grades[$grade['userid']]['grade'] = 0;
                }
            }
        }
        return $grades;
    }
}
