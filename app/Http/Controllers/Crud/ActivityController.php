<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Activity;
use App\Models\ViewActivity;
use Illuminate\Http\Request;

class ActivityController extends Controller
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
    function getActivitiesByItemId($id)
    {
        $activities =  ViewActivity::where('item_id', $id)->get();
        return response()->json($activities, 200);
    }
    function create(Request $request)
    {
        $id = $request->input('itemid');
        $name = $request->input('name');
        $modname = $request->input('modname');
        $instance = $request->input('instance');
        $cmid = $request->input('cmid');
        $url = $request->input('url');
        try {
            /*  $results = DB::table('malla_activities')->insertGetId(
                ['item_id' => $id, 'name' => $name, 'modname' => $modname, 'instance' => $instance, 'cmid' => $cmid, 'url' => $url]
            );
            $res =  DB::table('view_activities')->where('id', $results)->get(); */
            $activity = Activity::create(
                [
                    'item_id' => $id, 'name' => $name, 'modname' => $modname,
                    'instance' => $instance, 'cmid' => $cmid, 'url' => $url
                ]
            );
            return response($activity, 200);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 201);
        }
    }
    function delete($id)
    {
        try {
            /* $results = DB::table('malla_activities')
                ->where('id', $id)
                ->delete(); */
            $activity = Activity::destroy($id);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 201);
        }
        return response()->json($activity, 200);
    }
}
