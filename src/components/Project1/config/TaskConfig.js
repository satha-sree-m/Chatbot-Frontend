
import ShoppingCartApp from "../Day 1/CartItems";
import TaskCounter from "../Day 1/Counter";
import Dice from "../Day 1/DiceRoll";
import UsernameFormatter from "../Day 1/Formatter";
import MultTable from "../Day 1/MulTable";
import Settings from "../Day 1/Objects";
import PalindromeCrter from "../Day 1/Pallindrome";
import ProfileCard from "../Day 1/ProfileCard";
import InterestCalculator from "../Day 1/Si";
import TodoApp from "../Day 1/TodoList";

 const TaskConfig = [
   {
    key:"counter",
    label:"Counter",
    path:"/counter",
    component: TaskCounter
    },

 {
    key:"table",
    label:"Table",
    path:"/table",
    component: MultTable
 },

 {
    key:"interest",
    label:"Interest",
    path:"/interest",
    component: InterestCalculator 
 },

 {
    key:"dice",
    label:"Dice",
    path:"/dice",
    component: Dice

 },

 {
    key:"Formatter",
    label:"Formatter",
    path:"/formatter",
    component:UsernameFormatter


 },

 {
    key:"palindrome",
    label:"Palindrome",
    path:"/palindrome",
    component:PalindromeCrter
 },

 {
    key:"profile",
    label:"Profile",
    path:"/profile",
    component:ProfileCard
 },

 {
    key:"settings",
    label:"Settings",
    path:"/settings",
    component:Settings
 },

 {
    key:"todo",
    label:"To Do Lists",
    path:"/todo",
    component:TodoApp 
 },
 {
    key:"cart",
    label:"Cart",
    path:"/cart",
    component: ShoppingCartApp
   


 }
 ];
 export default TaskConfig;

    