// ============================================
// CLASE ARMA
// ============================================

class Arma {
    private nombre: string;
    private danio: number;

    constructor(nombre: string, danio: number) {
        this.nombre = nombre;
        this.danio = danio;
    }

    atacar(): string {
        return `⚔️ Ataque con ${this.nombre}: ${this.danio} puntos de daño`;
    }

    getDanio(): number {
        return this.danio;
    }

    getNombre(): string {
        return this.nombre;
    }
}

// ============================================
// CLASE HABILIDAD
// ============================================

class Habilidad {
    private nombre: string;
    private poder: number;

    constructor(nombre: string, poder: number) {
        this.nombre = nombre;
        this.poder = poder;
    }

    usar(): string {
        return `✨ Se utiliza ${this.nombre}: ${this.poder} puntos de poder`;
    }

    getNombre(): string {
        return this.nombre;
    }

    getPoder(): number {
        return this.poder;
    }
}

// ============================================
// CLASE PERSONAJE
// ============================================

class Personaje {
    private nombre: string;
    private vida: number;
    private vidaMaxima: number;
    private arma: Arma | null;  // Agregación: referencia a un objeto externo
    private habilidad: Habilidad | null;  // Agregación: referencia a un objeto externo

    constructor(nombre: string, vida: number, arma: Arma | null, habilidad: Habilidad | null) {
        this.nombre = nombre;
        this.vida = vida;
        this.vidaMaxima = vida;
        this.arma = arma;
        this.habilidad = habilidad;
    }

    atacar(): string | null {
        if (this.arma) {
            return `${this.nombre} ataca:\n${this.arma.atacar()}`;
        }
        return null;
    }

    usarHabilidad(): string | null {
        if (this.habilidad) {
            return `${this.nombre} utiliza una habilidad:\n${this.habilidad.usar()}`;
        }
        return null;
    }

    cambiarArma(nuevaArma: Arma): string {
        this.arma = nuevaArma;
        return `${this.nombre} ahora utiliza ${nuevaArma.getNombre()}`;
    }

    recibirDanio(danio: number): string {
        this.vida = Math.max(0, this.vida - danio);
        return `${this.nombre} recibió ${danio} puntos de daño.\nVida restante: ${this.vida}`;
    }

    getArma(): Arma | null {
        return this.arma;
    }

    getHabilidad(): Habilidad | null {
        return this.habilidad;
    }

    getVida(): number {
        return this.vida;
    }

    getVidaMaxima(): number {
        return this.vidaMaxima;
    }

    getNombre(): string {
        return this.nombre;
    }
}

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================

class Juego {
    private guerrero: Personaje;
    private armas: Map<string, Arma>;
    private habilidades: Map<string, Habilidad>;

    constructor() {
        // Creamos armas (objetos externos que vivirán durante todo el juego)
        this.armas = new Map([
            ['espada', new Arma('Espada de fuego', 30)],
            ['arco', new Arma('Arco mágico', 20)],
            ['hacha', new Arma('Hacha de guerra', 40)],
            ['lanza', new Arma('Lanza sagrada', 35)]
        ]);

        // Creamos habilidades (objetos externos)
        this.habilidades = new Map([
            ['curacion', new Habilidad('Curación', 25)],
            ['escudo', new Habilidad('Escudo mágico', 15)]
        ]);

        // Creamos el guerrero usando AGREGACIÓN
        // El guerrero tiene referencias a objetos externos, no los crea ni los destruye
        this.guerrero = new Personaje(
            'Guerrero',
            100,
            this.armas.get('espada')!,
            this.habilidades.get('curacion')!
        );

        this.inicializarEventos();
        this.actualizarUI();
        this.agregarMensaje('Juego iniciado. El Guerrero está listo para combatir.', 'info');
    }

    private inicializarEventos(): void {
        // Botón de atacar
        document.getElementById('btn-atacar')?.addEventListener('click', () => {
            const resultado = this.guerrero.atacar();
            if (resultado) {
                this.agregarMensaje(resultado, 'ataque');
            }
        });

        // Botón de usar habilidad
        document.getElementById('btn-habilidad')?.addEventListener('click', () => {
            const resultado = this.guerrero.usarHabilidad();
            if (resultado) {
                this.agregarMensaje(resultado, 'habilidad');
            }
        });

        // Botón de recibir daño
        document.getElementById('btn-recibir-danio')?.addEventListener('click', () => {
            const resultado = this.guerrero.recibirDanio(20);
            this.agregarMensaje(resultado, 'danio');
            this.actualizarUI();
        });

        // Botones de cambio de arma (AGREGACIÓN)
        document.querySelectorAll('.btn-cambiar-arma').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tipoArma = target.dataset.arma;
                if (tipoArma) {
                    this.cambiarArma(tipoArma);
                }
            });
        });
    }

    private cambiarArma(tipoArma: string): void {
        const nuevaArma = this.armas.get(tipoArma);
        if (nuevaArma) {
            // Cambiamos el arma del guerrero mediante AGREGACIÓN
            // El guerrero ahora referencia a un objeto Arma diferente
            const mensaje = this.guerrero.cambiarArma(nuevaArma);
            this.agregarMensaje(mensaje, 'cambio');
            this.actualizarUI();
        }
    }

    private actualizarUI(): void {
        // Actualizar información del guerrero
        const nombreEl = document.getElementById('guerrero-nombre');
        if (nombreEl) nombreEl.textContent = this.guerrero.getNombre();

        // Actualizar barra de vida
        const vidaBarra = document.getElementById('vida-barra');
        const vidaTexto = document.getElementById('vida-texto');
        const porcentajeVida = (this.guerrero.getVida() / this.guerrero.getVidaMaxima()) * 100;
        
        if (vidaBarra) vidaBarra.style.width = `${porcentajeVida}%`;
        if (vidaTexto) vidaTexto.textContent = `${this.guerrero.getVida()}/${this.guerrero.getVidaMaxima()} HP`;

        // Actualizar arma equipada
        const arma = this.guerrero.getArma();
        if (arma) {
            const armaNombre = document.getElementById('arma-nombre');
            const armaDanio = document.getElementById('arma-danio');
            
            if (armaNombre) armaNombre.textContent = arma.getNombre();
            if (armaDanio) armaDanio.textContent = `⚔️ ${arma.getDanio()} daño`;
        }

        // Actualizar habilidad equipada
        const habilidad = this.guerrero.getHabilidad();
        if (habilidad) {
            const habilidadNombre = document.getElementById('habilidad-nombre');
            const habilidadPoder = document.getElementById('habilidad-poder');
            
            if (habilidadNombre) habilidadNombre.textContent = habilidad.getNombre();
            if (habilidadPoder) habilidadPoder.textContent = `✨ ${habilidad.getPoder()} poder`;
        }
    }

    private agregarMensaje(mensaje: string, tipo: string): void {
        const consola = document.getElementById('consola');
        if (consola) {
            const mensajeEl = document.createElement('div');
            mensajeEl.className = `mensaje mensaje-${tipo}`;
            mensajeEl.innerHTML = mensaje.replace(/\n/g, '<br>');
            consola.insertBefore(mensajeEl, consola.firstChild);
            
            // Mantener solo los últimos 20 mensajes
            while (consola.children.length > 20) {
                consola.removeChild(consola.lastChild!);
            }
        }
    }
}

// Iniciar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Juego();
});