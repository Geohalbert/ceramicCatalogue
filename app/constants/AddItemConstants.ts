import { TFunction } from "i18next";

export const getClayTypeOptions = (t: TFunction) => [
  { label: t('dropdown.clayTypes.porcelain'), value: "Porcelain" },
  { label: t('dropdown.clayTypes.cincoRojo'), value: "Cinco Rojo" },
  { label: t('dropdown.clayTypes.cincoBlanco'), value: "Cinco Blanco" },
  { label: t('dropdown.clayTypes.buffaloWallow'), value: "Buffalo Wallow" },
  { label: t('dropdown.clayTypes.darkChocolate'), value: "Dark Chocolate" },
  { label: t('dropdown.clayTypes.custom'), value: "Custom" },
  { label: t('dropdown.clayTypes.other'), value: "Other" },
];

export const getDesignTypeOptions = (t: TFunction) => [
  { label: t('dropdown.designTypes.pot'), value: "Pot" },
  { label: t('dropdown.designTypes.vase'), value: "Vase" },
  { label: t('dropdown.designTypes.platter'), value: "Platter" },
  { label: t('dropdown.designTypes.mug'), value: "Mug" },
  { label: t('dropdown.designTypes.bowl'), value: "Bowl" },
  { label: t('dropdown.designTypes.tile'), value: "Tile" },
  { label: t('dropdown.designTypes.other'), value: "Other" },
];

export const getPotStatusOptions = (t: TFunction) => [
  { label: t('dropdown.statuses.inProgress'), value: "In Progress" },
  { label: t('dropdown.statuses.drying'), value: "Drying" },
  { label: t('dropdown.statuses.firing'), value: "Firing" },
  { label: t('dropdown.statuses.finished'), value: "Finished" },
];

export const getGlazeTypeOptions = (t: TFunction) => [
  { label: t('dropdown.glazeTypes.noGlaze'), value: "No Glaze" },
  { label: t('dropdown.glazeTypes.matte'), value: "Matte" },
  { label: t('dropdown.glazeTypes.gloss'), value: "Gloss" },
];