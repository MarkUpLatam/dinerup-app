import { ecuadorProvinces } from "../../data/ecuadorProvinces";

export default function Step3Address({ data, setData, nextStep, prevStep }) {
  const direccion = data.solicitante.direccion;

  const provinces = ecuadorProvinces.Ecuador;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      const newDireccion = {
        ...prev.solicitante.direccion,
        [name]: value,
      };

      // Si cambia la provincia, resetear cantón
      if (name === "provincia") {
        newDireccion.canton = "";
      }

      return {
        ...prev,
        solicitante: {
          ...prev.solicitante,
          direccion: newDireccion,
        },
      };
    });
  };

  const getAvailableCitiesCantons = () => {
    if (!direccion.provincia) return [];

    const provinciaObj = provinces.find(
      (p) => p.provincia === direccion.provincia
    );

    return provinciaObj ? provinciaObj.ciudades : [];
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Domicilio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="Provincia *"
          name="provincia"
          value={direccion.provincia}
          onChange={handleChange}
          options={provinces.map((p) => p.provincia)}
        />

        <Select
          label="Cantón/Ciudad *"
          name="canton"
          value={direccion.canton}
          onChange={handleChange}
          options={getAvailableCitiesCantons()}
          disabled={!direccion.provincia}
        />

        <Input
          label="Barrio/Parroquia *"
          name="barrio"
          value={direccion.barrio}
          onChange={handleChange}
          placeholder="Ej: Centro"
        />

        <Input
          label="Calle Principal *"
          name="callePrincipal"
          value={direccion.callePrincipal}
          onChange={handleChange}
          placeholder="Ej: Calle 10 de Agosto"
        />

        <Input
          label="Número *"
          name="numero"
          value={direccion.numero}
          onChange={handleChange}
          placeholder="Ej: 123-45"
        />

        <Input
          label="Referencia de Ubicación"
          name="referenciaUbicacion"
          value={direccion.referenciaUbicacion}
          onChange={handleChange}
          placeholder="Ej: Frente al parque"
        />

        <Select
          label="Tipo de Vivienda *"
          name="tipoVivienda"
          value={direccion.tipoVivienda}
          onChange={handleChange}
          options={["PROPIA", "ALQUILADA", "FAMILIAR"]}
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border rounded-xl"
        >
          ← Atrás
        </button>

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
        className="w-full px-4 py-3 border rounded-xl bg-gray-50
        focus:ring-2 focus:ring-primary-600 transition outline-none"
      />
    </div>
  );
}

function Select({ label, value, options, disabled, ...props }) {
  return (
    <div>
      <label className="text-gray-700 font-medium mb-1">{label}</label>
      <select
        {...props}
        value={value}
        disabled={disabled}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50
        focus:ring-2 focus:ring-primary-600 transition outline-none disabled:opacity-50"
      >
        <option value="">Seleccione...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
