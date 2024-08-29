<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        if (!Schema::hasTable('deudas')) {
            Schema::create('deudas', function (Blueprint $table) {
                $table->id();
                //$table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
                $table->string('usuario_id')->nullable();
                $table->foreign('usuario_id')->references('id')->on('usuarios')
                    ->onDelete('set null');
                $table->decimal('monto_inicial', 10, 2);
                $table->decimal('interes', 5, 2)->default(0);
                $table->decimal('total_deuda', 10, 2);
                $table->timestamp('fecha_inicio');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deudas');
    }
};
