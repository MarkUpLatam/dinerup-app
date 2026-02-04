export default function Step1Identity({ data, setData, nextStep }) {
  const solicitante = data.solicitante;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      solicitante: {
        ...prev.solicitante,
        [name]: value,
      },
    }));
  };

  const handleEstadoCivilChange = (e) => {
    const estadoCivil = e.target.value;
    const tieneConyuge = estadoCivil === "CASADO";

    setData((prev) => {
      const newData = {
        ...prev,
        solicitante: {
          ...prev.solicitante,
          estadoCivil,
          tieneConyuge,
        },
        conyuge: prev.conyuge,
      };

      if (tieneConyuge && !prev.conyuge) {
        newData.conyuge = {
          nombres: "",
          apellidos: "",
          cedula: "",
          fechaNacimiento: "",
          estadoCivil: "",
          ocupacion: "",
          empresaTrabajo: "",
          telefono: "",
          tieneConyuge: false,
          direccion: {
            provincia: "",
            canton: "",
            barrio: "",
            callePrincipal: "",
            numero: "",
            referenciaUbicacion: "",
            tipoVivienda: "PROPIA",
          },
          actividadEconomica: {
            nombreNegocio: "",
            direccionNegocio: "",
            tiempoActividad: "",
            telefonoNegocio: "",
          },
          ingresoEgreso: {
            ingresoMensual: 0,
            egresoMensual: 0,
          },
          referencias: [
            {
              nombreCompleto: "",
              tipo: "PERSONAL",
              parentesco: "",
              telefono: "",
            },
          ],
        };
      }

      if (!tieneConyuge) {
        newData.conyuge = null;
      }

      return newData;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Identidad del Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Cédula *"
          name="cedula"
          value={solicitante.cedula}
          onChange={handleChange}
          placeholder="Ej: 1234567890"
          maxLength={10}
        />

        <Input
          label="Nombres *"
          name="nombres"
          value={solicitante.nombres}
          onChange={handleChange}
          placeholder="Ej: Juan"
        />

        <Input
          label="Apellidos *"
          name="apellidos"
          value={solicitante.apellidos}
          onChange={handleChange}
          placeholder="Ej: García Pérez"
        />

        <Input
          label="Fecha de Nacimiento *"
          type="date"
          name="fechaNacimiento"
          value={solicitante.fechaNacimiento}
          onChange={handleChange}
        />

        <Select
          label="Estado Civil *"
          name="estadoCivil"
          value={solicitante.estadoCivil}
          onChange={handleEstadoCivilChange}
          options={["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "UNIÓN LIBRE"]}
        />
      </div>

      <button
        onClick={nextStep}
        className="mt-8 w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
      >
        Siguiente →
      </button>
    </div>
  );
}

/* ======================
   COMPONENTES UI
====================== */

function Input({ label, value, ...props }) {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-1">{label}</label>
      <input
        {...props}
        value={value}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-600 transition outline-none"
      />
    </div>
  );
}

function Select({ label, value, options, ...props }) {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-1">{label}</label>
      <select
        {...props}
        value={value}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary-600 transition outline-none"
      >
        <option value="">Seleccione...</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}
