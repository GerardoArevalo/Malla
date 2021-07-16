<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{

    protected $table = 'malla_grades';
    protected $fillable = ['userid', 'username', 'item_id', 'value'];
}
