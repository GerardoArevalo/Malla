<?php

namespace App\Http\Controllers\Grade;

use App\Http\Controllers\Interfaces\IGrades;
use Illuminate\Support\Facades\DB;

class OnlineGrades extends IGrades
{

    public function __construct()
    {
    }
    public function retrieveAllGradesForStructure($structureid)
    {
    }
}
