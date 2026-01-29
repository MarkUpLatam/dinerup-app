export interface PersonalIdentityForm {
  tipoIdentificacion: string;
  identification: string;
  first_name1: string;
  first_name2: string;
  last_name1: string;
  last_name2: string;
  birthdate: string;
}

export interface PersonalDetailsForm {
  gender: string;
  nationality: string;
  civilStatus: string;
  profession: string;
  phone: string;
  email: string;
}

export interface AddressForm {
  province: string;
  city: string;
  parish: string;
  address: string;
  reference: string;
  housingType: string;
  residenceTime: string;
}

export interface OnboardingFormData {
  identity: PersonalIdentityForm;
  details: PersonalDetailsForm;
  address: AddressForm;
}
