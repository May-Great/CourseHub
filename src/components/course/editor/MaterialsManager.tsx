import { Material } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Plus, Trash } from 'lucide-react';

interface MaterialsManagerProps {
  materials: Material[];
  onChange: (materials: Material[]) => void;
}

export function MaterialsManager({ materials, onChange }: MaterialsManagerProps) {
  
  const addMaterial = () => {
    const newMaterial: Material = {
      type: 'link',
      title: 'Новый материал',
      url: ''
    };
    onChange([...materials, newMaterial]);
  };

  const updateMaterial = (index: number, field: keyof Material, value: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    onChange(updatedMaterials);
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    onChange(updatedMaterials);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Материалы и ссылки</label>
        <Button size="sm" variant="ghost" onClick={addMaterial} className="text-primary-600 hover:bg-primary-50">
          <Plus className="w-3 h-3 mr-1" /> Добавить
        </Button>
      </div>
      
      <div className="space-y-3">
        {materials.map((material, idx) => (
          <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <select
                  value={material.type}
                  onChange={(e) => updateMaterial(idx, 'type', e.target.value)}
                  className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500"
                >
                  <option value="link">Ссылка</option>
                  <option value="pdf">PDF</option>
                  <option value="file">Файл</option>
                </select>
                <input
                  type="text"
                  value={material.title}
                  onChange={(e) => updateMaterial(idx, 'title', e.target.value)}
                  placeholder="Название материала"
                  className="flex-1 bg-transparent border-b border-slate-200 focus:border-primary-500 text-sm px-1 focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={material.url}
                onChange={(e) => updateMaterial(idx, 'url', e.target.value)}
                placeholder="URL (https://...)"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>
            <button 
              onClick={() => removeMaterial(idx)}
              className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity self-center"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        {materials.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Нет прикрепленных материалов
          </p>
        )}
      </div>
    </div>
  );
}
