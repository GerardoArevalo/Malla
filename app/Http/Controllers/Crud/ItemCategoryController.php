<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\ItemCategory;
use App\Models\ViewItemCategory;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class ItemCategoryController extends Controller
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

    function getItemCategoriesByStructureId($id)
    {
        //$results =  DB::table('view_item_categories')->where('structure_id', $id)->get();
        $item_categories = ViewItemCategory::where('structure_id', $id)->get();
        return response()->json($item_categories, 200);
    }
    function read($id)
    {
        $item_category = ViewItemCategory::findOrFail($id);
        return response()->json($item_category, 200);
    }
    public static function createAllItemCategoriesForStructure($structureId)
    {
        ItemCategory::insert([
            ['structure_id' => $structureId, 'name' => 'Evaluación Continua 1 (EC)'],
            ['structure_id' => $structureId, 'name' => 'Evaluación Continua 2 (EP)'],
            ['structure_id' => $structureId, 'name' => 'Evaluación del Profesor (EPF)'],
            ['structure_id' => $structureId, 'name' => 'Evaluación Final (EF)']
        ]);
    }
}
