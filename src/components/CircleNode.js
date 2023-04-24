import React from "react";
import { Handle } from "reactflow";

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

export default CircleNode;
