export default function Step3Address({ data, setData, nextStep, prevStep }) {
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const address = data.address;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Domicilio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Input label="Provincia" name="province" value={address.province} onChange={handleChange} />
        <Input label="Ciudad" name="city" value={address.city} onChange={handleChange} />
        <Input label="Parroquia" name="parish" value={address.parish} onChange={handleChange} />

        <Input label="Dirección" name="address" className="md:col-span-2" value={address.address} onChange={handleChange} />

        <Input label="Referencia" name="reference" className="md:col-span-2" value={address.reference} onChange={handleChange} />

        <Select
          label="Tipo de Vivienda"
          name="housingType"
          value={address.housingType}
          onChange={handleChange}
          options={["PROPIA", "ALQUILADA", "FAMILIAR"]}
        />

        <Select
          label="Tiempo de Residencia"
          name="residenceTime"
          value={address.residenceTime}
          onChange={handleChange}
          options={["MENOS DE 1 AÑO", "1-3 AÑOS", "3-5 AÑOS", "MÁS DE 5 AÑOS"]}
        />

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

function Input({ label, value, className, ...props }) {
  return (
    <div className={className}>
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
