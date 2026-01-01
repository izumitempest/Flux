import { Member, MemberStatus, Proposal } from './types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'President',
    joinedDate: '2023-01-15',
    status: MemberStatus.ACTIVE,
    avatar: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Treasurer',
    joinedDate: '2023-02-20',
    status: MemberStatus.ACTIVE,
    avatar: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Member',
    joinedDate: '2023-03-10',
    status: MemberStatus.INACTIVE,
    avatar: 'https://picsum.photos/100/100?random=3',
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Secretary',
    joinedDate: '2023-04-05',
    status: MemberStatus.ACTIVE,
    avatar: 'https://picsum.photos/100/100?random=4',
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Member',
    joinedDate: '2023-05-12',
    status: MemberStatus.PENDING,
    avatar: 'https://picsum.photos/100/100?random=5',
  },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Increase Coffee Budget',
    description: 'Proposal to increase the monthly office coffee budget by 20% to support local roasters.',
    votesFor: 45,
    votesAgainst: 12,
    endDate: '2024-11-01',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Remote Work Policy Update',
    description: 'Amend the bylaws to allow for 3 days of remote work per week for all eligible members.',
    votesFor: 120,
    votesAgainst: 30,
    endDate: '2024-10-25',
    status: 'Closed',
  },
];

export const CHART_DATA = [
  { name: 'Jan', members: 40 },
  { name: 'Feb', members: 55 },
  { name: 'Mar', members: 78 },
  { name: 'Apr', members: 90 },
  { name: 'May', members: 110 },
  { name: 'Jun', members: 135 },
];