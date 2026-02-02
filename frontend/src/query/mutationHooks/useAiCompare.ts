import { useMutation } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  AIFeedback,
  compareAnswersByAiTrainRecordsCardIdComparePost,
} from '@/api';

export const useAiCompare = (
  cardId: number,
  onSuccess?: (response: AIFeedback) => void
) => {
  const { mutate: compareAnswers, ...rest } = useMutation({
    mutationFn: (answer: string) =>
      dataExtractionWrapper(
        compareAnswersByAiTrainRecordsCardIdComparePost({
          path: { card_id: cardId },
          body: {
            answer,
          },
        })
      ),
    onSuccess,
  });
  return { compareAnswers, ...rest };
};
