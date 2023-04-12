import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
    getDocs,
    collection,
    addDoc,
    onSnapshot,
    query,
    updateDoc,
    doc,
} from "firebase/firestore";
import MiniMapNode from "../components/minimapnode";

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
const proOptions = { hideAttribution: true };

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

    const [addNode, setAddNode] = useState([]);

    const nodeCollectionRef = collection(db, "nodes");
    const edgeCollectionRef = collection(db, "edge");

    // Get nodes from firebase
    useEffect(() => {
        const getNodeList = () => {
            try {
                const nodeQuery = query(nodeCollectionRef);
                const unsubscribe = onSnapshot(nodeQuery, (querySnapshot) => {
                    const filteredNodeData = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setNodeList(filteredNodeData);
                    console.log(filteredNodeData);
                });

                // Cleanup subscription on unmount
                return () => {
                    unsubscribe();
                };
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

    // Add new node
    const createNewNode = async () => {
        try {
            await addDoc(nodeCollectionRef, {
                x: 50,
                y: 100,
                type: "circle",
                label: "New Node",
                avaliable: true,
            });
        } catch (err) {
            console.log(err);
        }
    };
    // update node position
    const updateNodePosition = async (nodeId, position) => {
        try {
            const nodeRef = doc(db, "nodes", nodeId);
            await updateDoc(nodeRef, {
                x: position.x,
                y: position.y,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="node-container">
            <div className="react-flow-wrapper">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={{ circle: CircleNode }}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDragStop={(event, node) =>
                        updateNodePosition(node.id, {
                            x: node.position.x,
                            y: node.position.y,
                        })
                    }
                    proOptions={proOptions}
                >
                    <Controls position="left" />
                    <MiniMap
                        position="bottom-right"
                        nodeColor="#d2a24c"
                        maskColor="rgb(204, 107, 73)"
                        maskStrokeWidth={2}
                        nodeComponent={MiniMapNode}
                        zoomable
                        pannable
                    />
                    <Background variant="dots" gap={25} size={1} />
                </ReactFlow>
                <button onClick={createNewNode}>Add Node</button>
                {/* <button onClick={saveNodes}>Save Changes</button> */}
            </div>
        </div>
    );
}
