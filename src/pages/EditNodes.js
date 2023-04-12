import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

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

const initialNodes = [];
const initialEdges = [];

const CircleNode = ({ data }) => {
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
                    backgroundColor: "#d2a24c",
                }}
            >
                {data.label}
            </div>
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodeList, setNodeList] = useState([]);
    const [edgeList, setEdgeList] = useState([]);

    const nodeCollectionRef = collection(db, "nodes");
    const edgeCollectionRef = collection(db, "edge");

    // Get nodes from firebase
    useEffect(() => {
        const getNodeList = async () => {
            try {
                const data = await getDocs(nodeCollectionRef);
                const filteredNodeData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setNodeList(filteredNodeData);
                console.log(filteredNodeData);
            } catch (err) {
                console.log(err);
            }
        };

        getNodeList();
    }, []);

    // Get edges from firebase
    useEffect(() => {
        const getEdgeList = async () => {
            try {
                const data = await getDocs(edgeCollectionRef);
                const filteredEdgeData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setEdgeList(filteredEdgeData);
                console.log(filteredEdgeData);
            } catch (err) {
                console.log(err);
            }
        };

        getEdgeList();
    }, []);

    // set nodes from firebase
    useEffect(() => {
        const newNodes = nodeList.map((node) => {
            return {
                id: node.id,
                type: node.type,
                position: { x: node.x, y: node.y },
                data: { label: node.label },
            };
        });
        setNodes(newNodes);
    }, [nodeList]);

    // set edges from firebase
    useEffect(() => {
        const newEdges = edgeList.map((edge) => {
            return {
                source: edge.source,
                target: edge.target,
                animated: edge.animated,
            };
        });
        setEdges(newEdges);
    }, [edgeList]);

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
                <Controls position="left" />
                <MiniMap />
                <Background variant="dots" gap={25} size={1} />
            </ReactFlow>
        </div>
    );
}
