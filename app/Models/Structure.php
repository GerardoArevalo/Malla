<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Structure extends Model
{

    protected $table = 'malla_structures';
    protected $fillable = ['name', 'moodle_id', 'courseid', 'mode', 'mode_value'];
}
