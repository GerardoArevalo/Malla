<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Data\MoodleRequestFacade;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class CourseDataController extends Controller
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

    function getCourseActivities($moodleid, $courseid)
    {
        $activities = [];

        //Get all assigns in course
        $funcion = "core_course_get_contents";
        $params = [];
        $params['courseid'] = $courseid;
        $params['options[0][name]'] = "modname";
        $params['options[0][value]'] = "assign";
        $moodleRequest = new MoodleRequestFacade;
        $activity_array = $moodleRequest->makeMoodleApiRequest($moodleid, $funcion, $params);
        foreach ($activity_array as $element) {
            foreach ($element['modules'] as $module) {
                $data = [];
                $data['id'] = $module['id'];
                $data['url'] = $module['url'];
                $data['name'] = $module['name'];
                $data['modname'] = $module['modname'];
                $data['instance'] = $module['instance'];
                array_push($activities, $data);
            }
        }

        //Get all quizes in course
        $params['options[0][value]'] = "quiz";
        $moodleRequest = new MoodleRequestFacade;
        $quiz_array = $moodleRequest->makeMoodleApiRequest($moodleid, $funcion, $params);
        foreach ($quiz_array as $element) {
            foreach ($element['modules'] as $module) {
                $data = [];
                $data['id'] = $module['id'];
                $data['url'] = $module['url'];
                $data['name'] = $module['name'];
                $data['modname'] = $module['modname'];
                $data['instance'] = $module['instance'];
                array_push($activities, $data);
            }
        }

        return response($activities, 200);
    }
    function getCourseGroups($moodleid, $courseid)
    {

        $funcion = "core_group_get_course_groups";
        $params = [];
        $params['courseid'] = $courseid;
        $moodleRequest = new MoodleRequestFacade;
        $group_array = $moodleRequest->makeMoodleApiRequest($moodleid, $funcion, $params);
        $groups = [];
        foreach ($group_array as $group) {
            $data = [];
            $data['id'] = $group['id'];
            $data['name'] = $group['name'];
            $data['courseid'] = $group['courseid'];
            array_push($groups, $data);
        }
        return response($groups, 200);
    }
}
