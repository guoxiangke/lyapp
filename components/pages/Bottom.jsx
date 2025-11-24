import {
  IonImg
} from '@ionic/react';

const Bottom = () => {
  return (
    <div>
      <div className="flex justify-center text-gray-400 mt-4">
        <a href={process.env.officialUrl} rel="noreferrer" target="_blank">
          <p>良友随身听</p>
        </a>
      </div>
    </div>
  );
};

export default Bottom;
