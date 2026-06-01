const Header = (props) => {
  return <h2>{props.course}</h2>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part =>
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      total of {props.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
    </p>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <b><Total parts={props.course.parts} /></b>
    </div>
  )
}

export default Course