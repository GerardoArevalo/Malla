<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMallaGrades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('malla_grades', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('userid');
            $table->string('username');
            $table->foreignId('item_id')->constrained('malla_items')->onDelete('cascade');
            $table->double('value', 5, 2)->default(0.0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('malla_grades');
    }
}
