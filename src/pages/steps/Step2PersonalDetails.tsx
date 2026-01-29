export default function Step2PersonalDetails({ data, setData, nextStep, prevStep }) {
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const details = data.details;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Datos Personales</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Select
          label="Sexo"
          name="gender"
          value={details.gender}
          onChange={handleChange}
          options={["MASCULINO", "FEMENINO", "OTRO"]}
        />

        <Select
          label="Estado Civil"
          name="civilStatus"
          value={details.civilStatus}
          onChange={handleChange}
          options={["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO"]}
        />

        <Input label="Nacionalidad" name="nationality" value={details.nationality} onChange={handleChange} />
        <Input label="Profesión" name="profession" value={details.profession} onChange={handleChange} />
        <Input label="Teléfono" name="phone" value={details.phone} onChange={handleChange} />
        <Input label="Correo" name="email" type="email" value={details.email} onChange={handleChange} />

      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="px-6 py-3 border rounded-xl">← Atrás</button>

        <button
          onClick={nextStep}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
        >
          Siguiente →
        </button>
      </div>
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
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
