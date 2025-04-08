import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={() => setCount(count + 1)}>Incrémenter</button>
            <button onClick={() => setCount(count - 1)}>Décrémenter</button>
        </div>
    );
};

export default Counter;