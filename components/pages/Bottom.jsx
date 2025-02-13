import {
  IonImg
} from '@ionic/react';

const Bottom = () => {
  return (
    <div>
      <div className="flex justify-center text-gray-400 mt-4">
        <a href={process.env.officialUrl} rel="noreferrer" target="_blank">
          <IonImg className="w-24" src="/ly_logo.png" alt="良友电台" title="良友电台" />
        </a>
      </div>
    </div>
  );
};

export default Bottom;
