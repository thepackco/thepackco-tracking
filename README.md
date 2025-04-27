# 📦 Omnitech Tracking

Bienvenido a **Omnitech Tracking**, un sistema diseñado para gestionar y hacer seguimiento eficiente de pedidos y entregas. Este proyecto busca optimizar la visibilidad en la cadena logística, garantizando una experiencia de usuario moderna y confiable.

## 🚀 Características principales

- Seguimiento en tiempo real de órdenes y envíos.
- Gestión de estados de pedidos.
- Integración con servicios externos para actualización automática.
- Registro de eventos y excepciones para auditoría.

## 🛠️ Tecnologías utilizadas

- **Python** 3.x
- **Django** (Backend)
- **PostgreSQL** (Base de datos)
- **Redis** (Cache y mensajes en tiempo real)
- **Docker** (Despliegue y ambientes consistentes)

## 📦 Instalación y configuración

1. Clona el repositorio:

   ```bash
   git clone https://github.com/yourusername/thepackco-tracking.git
   cd thepackco-tracking
   ```

2. Crea un entorno virtual e instala las dependencias:

   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

3. Configura el archivo `.env` con tus variables de entorno.

4. Aplica las migraciones:

   ```bash
   python manage.py migrate
   ```

5. Corre el servidor:
   ```bash
   python manage.py runserver
   ```

## 🧪 Tests

Para ejecutar los tests:

```bash
python manage.py test
```

## 📈 Roadmap

- [ ] Agregar notificaciones push para cambios de estado.
- [ ] Implementar panel de analítica avanzada.
- [ ] Mejorar la cobertura de pruebas unitarias.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!  
Por favor, abre un **Issue** o envía un **Pull Request**.

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
