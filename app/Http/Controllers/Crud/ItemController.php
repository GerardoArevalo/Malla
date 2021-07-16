<?php

namespace App\Http\Controllers\Crud;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ViewItem;
use Illuminate\Http\Request;

class ItemController extends Controller
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
    function getItemsByItemCategoryId($id)
    {
        $items = ViewItem::where('category_id', $id)->get();
        return response()->json($items, 200);
    }
    function create(Request $request)
    {
        $id = $request->input('itemcategoryid');
        $name = $request->input('name');
        $editable = $request->input('editable');
        $weight = $request->input('weight');

        try {
            $item = Item::create(
                ['category_id' => $id, 'name' => $name, 'editable' => $editable, 'weight' => $weight]
            );
            return response($item, 200);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 201);
        }
    }
    function update(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');
        $item = Item::findOrFail($id);
        $item->name = $name;
        $item->save();
        return response()->json($item, 200);
    }
    function delete($id)
    {
        try {
            $item = Item::destroy($id);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 201);
        }
        return response()->json([$item], 200);
    }
}
