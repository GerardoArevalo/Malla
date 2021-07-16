<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{

    protected $table = 'malla_items';
    protected $fillable = ['name', 'category_id', 'weight', 'editable'];
}
