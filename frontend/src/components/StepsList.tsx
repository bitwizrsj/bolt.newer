import React from 'react';
import { CheckCircle, Circle, Clock, FileText, Terminal, Folder } from 'lucide-react';
import { Step, StepType } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  const getStepIcon = (step: Step) => {
    if (step.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (step.status === 'in-progress') {
      return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
    }

    switch (step.type) {
      case StepType.CreateFile:
        return <FileText className="w-4 h-4 text-gray-500" />;
      case StepType.CreateFolder:
        return <Folder className="w-4 h-4 text-gray-500" />;
      case StepType.RunScript:
        return <Terminal className="w-4 h-4 text-gray-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-4 space-y-2">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === step.id
              ? 'bg-gray-800 border border-gray-700 shadow-lg'
              : 'hover:bg-gray-800/50'
          }`}
          onClick={() => onStepClick(step.id)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-sm ${
                step.status === 'completed' ? 'text-green-400' : 'text-gray-200'
              }`}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {step.description}
                </p>
              )}
              {step.path && (
                <p className="text-xs text-blue-400 mt-1 font-mono">
                  {step.path}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}