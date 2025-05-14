const KeyList = ({ keys }) => {
    return (
        <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold">Key Anda:</h2>
            <ul className="list-disc pl-5 space-y-2">
                {keys.map((key, index) => (
                    <li key={index} className="text-sm text-gray-700">
                        {key.key} - {key.durasi}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KeyList;
