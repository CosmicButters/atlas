import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import CircleNode from "../components/CircleNode";
import {
    getDocs,
    collection,
    addDoc,
    onSnapshot,
    query,
    updateDoc,
    doc,
    deleteDoc,
    setDoc,
    DocumentReference,
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

export default function App() {
    const nodeTypes = useMemo(() => ({ circle: CircleNode }), []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [nodeList, setNodeList] = useState([]);
    const [edgeList, setEdgeList] = useState([]);
    const [tempNodePositions, setTempNodePositions] = useState({});
    const [tempEdges, setTempEdges] = useState([]);

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
                });
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
            } catch (err) {
                console.log(err);
            }
        };
        getEdgeList();
    }, []);

    // set nodes to firebase
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

    // set edges to firebase
    useEffect(() => {
        const newEdges = edgeList.map((edge) => {
            return {
                source: edge.source,
                target: edge.target,
                animated: edge.animated,
            };
        });
        setEdges(newEdges);
        console.log(newEdges);
    }, [edgeList]);

    // Add new node
    const createNewNode = async () => {
        try {
            await addDoc(nodeCollectionRef, {
                x: 100,
                y: 100,
                type: "circle",
                label: "New Node",
                avaliable: true,
            });
        } catch (err) {
            console.log(err);
        }
    };
    //temp Save
    const saveFlow = async () => {
        try {
            // Save node positions
            for (const nodeId in tempNodePositions) {
                const nodeRef = doc(db, "nodes", nodeId);
                const position = tempNodePositions[nodeId];
                await updateDoc(nodeRef, {
                    x: position.x,
                    y: position.y,
                });
            }

            // Save edges
            for (const edge of tempEdges) {
                await addDoc(edgeCollectionRef, edge);
            }

            // Clear the temporary node positions and edges after saving
            setTempNodePositions({});
            setTempEdges([]);
        } catch (err) {
            console.log(err);
        }
    };

    // Delete node
    const deleteNode = async (node) => {
        try {
            console.log(node.id);
            const nodeRef = doc(nodeCollectionRef, node);
            await deleteDoc(nodeRef);
        } catch (err) {
            console.log(err);
        }
    };

    // update node position
    const updateNodePosition = (nodeId, position) => {
        setTempNodePositions((prevPositions) => ({
            ...prevPositions,
            [nodeId]: position,
        }));
    };

    //edge Connect
    const onConnect = useCallback(
        (params) => {
            console.log(params);

            setTempEdges((prevEdges) => [
                ...prevEdges,
                {
                    source: params.source,
                    target: params.target,
                    animated: params.animated || false,
                },
            ]);
        },
        [setTempEdges]
    );

    return (
        <div className="node-container">
            <div className="react-flow-wrapper">
                <ReactFlow
                    nodes={nodes}
                    edges={[...edges, ...tempEdges]}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={deleteNode}
                    // onEdgeClick={onEdgeClick}
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
                <button onClick={saveFlow}>Save</button>
            </div>
        </div>
    );
}
