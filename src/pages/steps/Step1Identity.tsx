export default function Step1Identity({ data, setData, nextStep }) {
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const identity = data.identity;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Identidad del Cliente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Select
          label="Tipo de Identificación"
          name="tipoIdentificacion"
          value={identity.tipoIdentificacion}
          onChange={handleChange}
          options={["CEDULA", "PASAPORTE", "RUC"]}
        />

        <Input
          label="Número de Identificación"
          name="identification"
          value={identity.identification}
          onChange={handleChange}
        />

        <Input label="Primer Nombre" name="first_name1" value={identity.first_name1} onChange={handleChange} />
        <Input label="Segundo Nombre" name="first_name2" value={identity.first_name2} onChange={handleChange} />
        <Input label="Primer Apellido" name="last_name1" value={identity.last_name1} onChange={handleChange} />
        <Input label="Segundo Apellido" name="last_name2" value={identity.last_name2} onChange={handleChange} />

        <Input
          label="Fecha de Nacimiento"
          type="date"
          name="birthdate"
          value={identity.birthdate}
          onChange={handleChange}
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

function Input({ label, value, ...props }) {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-1">{label}</label>
      <input
        {...props}
        value={value}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2
        focus:ring-primary-600 transition outline-none"
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
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2
        focus:ring-primary-600 transition outline-none"
      >
        <option value="">Seleccione...</option>
        {options.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  );
}
