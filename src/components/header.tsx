import Nav from "../ui/nav";
export default function Header() {
    return <>
        <Nav />
        <Title />
    </>
}

function Title() {
    return <div className="grid grid-cols-1 grid-rows-1 items-center justify-center *:[grid-column:1] *:[grid-row:1]">
        <h1 className="text-[7.5rem] font-bold text-blue-950 opacity-5 text-center">Medic</h1>
        <div className="flex flex-col items-center justify-center">
            <h3 className="text-blue-950 text-xl font-bold text-center">Diagnose your condition</h3>
            <span className="text-blue-950 text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. </span>
        </div>
    </div>
}