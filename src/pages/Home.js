import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
    {
        id: "1",
        type: "circle",
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 - 50 },
        data: { label: "1" },
    },
    {
        id: "2",
        type: "circle",
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 + 50 },
        data: { label: "2" },
    },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const CircleNode = ({ data }) => {
    const history = useNavigate();

    const handleClick = () => {
        history.push("/nodes");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Handle type="target" position="top" />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50px",
                    height: "50px",
                    borderRadius: "25px",
                    backgroundColor: "#61dafb",
                }}
            >
                {data.label}
            </div>
            <Handle type="source" position="bottom" />
            <button onClick={handleClick} style={{ marginTop: "5px" }}>
                Go to Nodes
            </button>
        </div>
    );
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={{ circle: CircleNode }}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={25} size={1} />
            </ReactFlow>
        </div>
    );
}
