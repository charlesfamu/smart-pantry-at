export type DishType = { 
  cuisine: string;
  dish: string;
  ingredients: {
    name: string;
    alternatives: string[];
  }[];
  preparationTime: string;
};

export type SuggestedDishesType = {
  originalDish: {
    name: string | null;
    ingredients: string[] | null;
  };
  missingIngredients: string[] | null;
  suggestedDishes: DishType[] | null;
}

export enum InventoryItemEnum  {
  StorageLocation = 'Storage Location',
  Door = 'Door',
  ExpiryDate = 'Expiry Date',
  Type = 'Type',
  ItemName = 'Item Name',
  Quantity = 'Quantity',
  Brand = 'Brand',
  PurchaseDate = 'Purchase Date',
}

export interface InventoryItem {
  [InventoryItemEnum.StorageLocation]?: string;
  [InventoryItemEnum.Door]?: string;
  [InventoryItemEnum.ExpiryDate]?: string;
  [InventoryItemEnum.Type]?: string;
  [InventoryItemEnum.ItemName]: string;
  [InventoryItemEnum.Quantity]?: string;
  [InventoryItemEnum.Brand]?: string[];
  [InventoryItemEnum.PurchaseDate]?: string;
}
