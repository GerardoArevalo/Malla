<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{

    protected $table = 'malla_item_categories';
    protected $fillable = ['name', 'structure_id'];
}
