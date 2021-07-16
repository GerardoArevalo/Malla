<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Data\MoodleRequestFacade;
use App\Models\ViewMoodle;

class UserDataController extends Controller
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

    function getMoodle($id)
    {
        $data =  ViewMoodle::findOrFail($id);
        $results = [];
        $results['name'] = $data->name;
        $results['mode'] = $data->mode;
        return response()->json($results, 200);
    }
    function getUserCourses($moodleid, $userid)
    {
        $funcion = "core_enrol_get_users_courses";
        $params = [];
        $params['userid'] = $userid;
        $moodleRequest = new MoodleRequestFacade;
        $course_array = $moodleRequest->makeMoodleApiRequest($moodleid, $funcion, $params);
        $courses = [];

        foreach ($course_array as $course) {
            $data = [];
            $data['id'] = $course['id'];
            $data['moodleid'] = $moodleid;
            $data['shortname'] = $course['shortname'];
            $data['fullname'] = $course['fullname'];
            array_push($courses, $data);
        }

        return response()->json($courses, 200);
        //->header('Access-Control-Allow-Origin', '*');
    }
}
