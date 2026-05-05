import { useQuery, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

const getAnalysisScore = (analysis, keys) => {
  for (const key of keys) {
    const value = analysis?.[key];
    if (value !== undefined && value !== null) return value;
  }
  return null;
};

const mergeAnalysisScores = (previousAnalysis, nextAnalysis) => {
  if (!nextAnalysis) return nextAnalysis;

  const scoreRichesse = getAnalysisScore(nextAnalysis, ['score_richesse', 'richesse_score', 'richness_score', 'richesse'])
    ?? getAnalysisScore(previousAnalysis, ['score_richesse', 'richesse_score', 'richness_score', 'richesse']);
  const scoreSimilarite = getAnalysisScore(nextAnalysis, ['score_similarite', 'similarite_score', 'similarity_score', 'similarite'])
    ?? getAnalysisScore(previousAnalysis, ['score_similarite', 'similarite_score', 'similarity_score', 'similarite']);

  return {
    ...nextAnalysis,
    score_richesse: scoreRichesse ?? nextAnalysis.score_richesse,
    richesse_score: scoreRichesse ?? nextAnalysis.richesse_score,
    richness_score: scoreRichesse ?? nextAnalysis.richness_score,
    richesse: scoreRichesse ?? nextAnalysis.richesse,
    score_similarite: scoreSimilarite ?? nextAnalysis.score_similarite,
    similarite_score: scoreSimilarite ?? nextAnalysis.similarite_score,
    similarity_score: scoreSimilarite ?? nextAnalysis.similarity_score,
    similarite: scoreSimilarite ?? nextAnalysis.similarite,
  };
};

export const useTicketDetail = (ticketId, options = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['developer', 'tickets', ticketId],
    queryFn: async () => {
      const ticket = await developerService.getTicketDetail(ticketId);
      const previousTicket = queryClient.getQueryData(['developer', 'tickets', ticketId]);

      if (ticket?.analysis || ticket?.analysis_data) {
        const previousAnalysis = previousTicket?.analysis ?? previousTicket?.analysis_data ?? null;
        if (ticket.analysis) {
          ticket.analysis = mergeAnalysisScores(previousAnalysis, ticket.analysis);
        }
        if (ticket.analysis_data) {
          ticket.analysis_data = mergeAnalysisScores(previousAnalysis, ticket.analysis_data);
        }
      }

      return ticket;
    },
    enabled: !!ticketId,
    ...options,
  });
};
