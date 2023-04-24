export default function MiniMapNode({ x, y, color }) {
    return <circle cx={x} cy={y} r="35" fill={color} />;
}
