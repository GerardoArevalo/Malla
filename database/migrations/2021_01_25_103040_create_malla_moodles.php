<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMallaMoodles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('malla_moodles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url');
            $table->string('token');
            $table->enum('mode', ['Online', 'Presencial']);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    //468879d741c2845d224fe5397780fce6
    //http://localhost/moodle
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('malla_moodles');
    }
}
