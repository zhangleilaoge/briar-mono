import { createContainer } from '@/pages/briar/hooks/useContainer';

import useConversationList from '../hooks/useConversationList';

export const conversationContainer = createContainer(useConversationList);
