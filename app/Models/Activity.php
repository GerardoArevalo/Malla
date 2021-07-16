<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{

    protected $table = 'malla_activities';
    protected $fillable = ['name', 'item_id', 'modname', 'instance', 'cmid', 'url'];
}
