<?php

namespace App\Http\Controllers\Grade;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{

    public function __construct()
    {
    }

    //obtener notas
    public function getGrades($id)
    {
        $grades = new UneatlanticoGrades;
        //from interface
        try {
            $result = $grades->getGradesByStructure($id);
        } catch (\Exception $e) {

            return response()->json($e->getMessage(), 201);
        }
        return response()->json($result, 200);
    }
    //get calculated grades with percentages 
    public function getFinalGrades($id)
    {
        $grades = new UneatlanticoGrades;
        //from interface
        try {
            $result = $grades->getFinalGrades($id);
        } catch (\Exception $e) {

            return response()->json($e->getMessage(), 201);
        }
        return response()->json($result, 200);
    }
    //calificar estructura
    public function updateAllItemGradesByStructure($id)
    {
        $grades = new UneatlanticoGrades;
        //from interface
        $result = $grades->retrieveAllGradesForStructure($id);
        return response()->json($result, 200);
    }
    //calificar manualmente
    public function gradeItemManually(Request $request)
    {
        $gradeId = $request->input('id');
        $value = $request->input('value');
        $grade = Grade::findOrFail($gradeId);
        $grade->value = $value;
        $grade->save();

        return response()->json($grade, 200);
    }

    //calificar item individual
    public function updateItemGrades($structureId, $itemId)
    {
        $grades = new UneatlanticoGrades;
        //from interface
        $result = $grades->updateOrCreateItemGrades($itemId, $structureId);
        return response()->json($result, 200);
    }
}
