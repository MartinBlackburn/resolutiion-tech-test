import Task from "@/components/Task";

const Home = () => {
    return (
        <div className="homePage">
            <Task id="1" title="Task 1" description="Task 1 description" status="TODO" createdAt="2025-01-01" />
        </div>
    );
};

export default Home;
