import { IntakeFlow } from './intake-flow';

export const metadata = {
  title: 'BLITZWORX - Intake',
  description: 'Intake vragenlijst voor je project bij BLITZWORX',
  robots: 'noindex, nofollow',
};

export default async function IntakePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <IntakeFlow token={token} />;
}
