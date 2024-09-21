import { InventoryItem, InventoryItemEnum } from '@/types';

export const extractItemName = (inventoryItem: InventoryItem[]): string[] => {
  return inventoryItem.map(item => {
    return item[InventoryItemEnum.ItemName];
  });
};