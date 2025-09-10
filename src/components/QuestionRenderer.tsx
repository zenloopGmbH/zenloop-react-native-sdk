import React from 'react';
import { View } from 'react-native';
import { Question } from '../types/question';
import { Theme } from '../types/theme';
import TextInput from './questions/TextInput';
import RadioGroup from './questions/RadioGroup';
import Checkbox from './questions/Checkbox';
import Rating from './questions/Rating';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  theme: Theme;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  error,
  theme,
}) => {
  switch (question.type) {
    case 'text':
    case 'comment':
      return (
        <TextInput
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          theme={theme}
        />
      );

    case 'radiogroup':
      return (
        <RadioGroup
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          theme={theme}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          theme={theme}
        />
      );

    case 'rating':
      return (
        <Rating
          question={question}
          value={value}
          onChange={onChange}
          error={error}
          theme={theme}
        />
      );

    default:
      console.warn(`Unsupported question type: ${(question as any).type}`);
      return null;
  }
};

export default QuestionRenderer;