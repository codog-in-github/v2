import Card from './Card';
import Message from './Message';

function MainContent() {
  return (
    <div className="p-4 flex-1">
      <div className="grid grid-cols-3 gap-4">
        <Card />
        <Card />
        <Card />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">直近完了</h2>
        <div className="flex space-x-4">
          <Card />
          <Card />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">社内伝達</h2>
        <div className="space-y-4">
          <Message />
          <Message />
          <Message />
        </div>
      </div>
    </div>
  );
}

export default MainContent;