<?php

namespace App\Http\Controllers\Interfaces;

use Illuminate\Support\Facades\DB;
use App\Models\ViewGrade;
use App\Models\ViewItemCategory;
use App\Models\ViewItem;

abstract class IGrades
{
    abstract protected function retrieveAllGradesForStructure($structureId);

    public function getGradesByStructure($structureId)
    {
        $item_categories = ViewItemCategory::where('structure_id', $structureId)->get();
        error_log($item_categories);
        foreach ($item_categories as $itemCategory) {
            $itemCategory->items = ViewItem::where('category_id', $itemCategory->id)->get();
            foreach ($itemCategory->items as $item) {
                $item->grades = ViewGrade::where('item_id', $item->id)->get();
            }
        }

        return $item_categories;
    }
}
