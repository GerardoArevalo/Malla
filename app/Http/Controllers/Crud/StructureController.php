<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use App\Models\Structure;
use App\Models\ViewStructure;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class StructureController extends Controller
{
    public function __construct()
    {
        //
    }

    function read($id)
    {
        $structure = ViewStructure::findOrFail($id);
        return response()->json($structure, 200);
    }
    function getAllStructuresByCourseId($id)
    {
        $structures = ViewStructure::where('courseid', $id)->get();
        return response()->json($structures, 200);
    }
    function create(Request $request)
    {
        $moodleid = $request->input('moodleid');
        $courseid = $request->input('courseid');
        $name = $request->input('name');
        $mode = $request->input('mode');
        $mode_value = $request->input('mode_value');

        try {
            /* $structureId = DB::table('malla_structures')->insertGetId(
                ['moodle_id' => $moodleid, 'courseid' => $courseid, 'name' => $name, 'groups' => $groups]
            ); */
            $structure = Structure::create([
                'name' => $name,
                'moodle_id' => $moodleid,
                'courseid' => $courseid,
                'mode' => $mode,
                'mode_value' => $mode_value
            ]);

            ItemCategoryController::createAllItemCategoriesForStructure($structure['id']);
        } catch (\Exception $e) {
            if ($e->getCode() === "23000")
                return response()->json($request . "moodle no definido: " . $e->getMessage(), 201);
            return response()->json($e->getMessage(), 201);
        }

        return response()->json([$structure], 201);
    }
    function update(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');

        $structure = Structure::findOrFail($id);
        $structure->name = $name;
        $structure->save();

        return response()->json([$structure], 200);
    }
    function delete($id)
    {

        try {
            $structure = Structure::destroy($id);
            /* $results = DB::table('malla_structures')
                ->where('id', $id)
                ->delete(); */
        } catch (\Exception $e) {
            if ($e->getCode() === "23000")
                return response()->json("moodle no definido: " . $e->getMessage(), 201);
            return response()->json($e->getMessage(), 201);
        }
        return response()->json([$structure], 200);
    }
}
