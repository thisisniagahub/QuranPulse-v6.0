import React from 'react';
import DailyAyatWidget from '../modules/quran/components/DailyAyatWidget';

type DailyVerseWidgetProps = React.ComponentProps<typeof DailyAyatWidget>;

const DailyVerseWidget: React.FC<DailyVerseWidgetProps> = (props) => {
  return <DailyAyatWidget {...props} />;
};

export default DailyVerseWidget;
