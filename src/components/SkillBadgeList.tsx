import React from 'react';

interface SkillBadgeListProps {
  skills: string[];
  onRemoveSkill: (skill: string) => void;
}

export const SkillBadgeList: React.FC<SkillBadgeListProps> = ({ skills, onRemoveSkill }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill) => (
        <span 
          key={skill} 
          className="px-4 py-2 bg-primary/10 text-primary font-label-md rounded-full border border-primary/20 flex items-center gap-2"
        >
          {skill} 
          <button 
            type="button"
            onClick={() => onRemoveSkill(skill)}
            className="material-symbols-outlined text-[16px] cursor-pointer hover:text-error focus:outline-none focus:ring-1 focus:ring-error rounded"
            aria-label={`Remove skill ${skill}`}
          >
            close
          </button>
        </span>
      ))}
    </div>
  );
};

export default SkillBadgeList;
